import { UtilityItem, LatLngPoint, RiskPredictionResult, RiskLevel, UtilityRiskDetail, UtilityType } from '../types';

// Haversine distance in meters between two lat/lng points
export function haversineDistanceMeters(p1: LatLngPoint, p2: LatLngPoint): number {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Distance from point P to line segment AB in meters
export function pointToSegmentDistanceMeters(
  p: LatLngPoint,
  a: LatLngPoint,
  b: LatLngPoint
): number {
  const l2 = Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2);
  if (l2 === 0) return haversineDistanceMeters(p, a);

  let t = ((p.lat - a.lat) * (b.lat - a.lat) + (p.lng - a.lng) * (b.lng - a.lng)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projection: LatLngPoint = {
    lat: a.lat + t * (b.lat - a.lat),
    lng: a.lng + t * (b.lng - a.lng),
  };

  return haversineDistanceMeters(p, projection);
}

// Minimum distance from excavation point to any point along a utility's polyline
export function getMinimumDistanceToUtility(
  point: LatLngPoint,
  utility: UtilityItem
): number {
  if (!utility.coordinates || utility.coordinates.length === 0) return 9999;
  if (utility.coordinates.length === 1) {
    return haversineDistanceMeters(point, utility.coordinates[0]);
  }

  let minDistance = Infinity;
  for (let i = 0; i < utility.coordinates.length - 1; i++) {
    const d = pointToSegmentDistanceMeters(
      point,
      utility.coordinates[i],
      utility.coordinates[i + 1]
    );
    if (d < minDistance) minDistance = d;
  }
  return minDistance;
}

// Random Forest Risk Calculation Proxy Algorithm
export function calculateExcavationRisk(
  targetLat: number,
  targetLng: number,
  plannedDepthMeters: number,
  excavationMethod: string,
  soilType: string,
  equipmentWeightTons: number,
  allUtilities: UtilityItem[],
  locationName: string = 'Custom Excavation Site',
  engineerName: string = 'Field Engineer',
  engineerRole: string = 'Excavation Safety Inspector'
): RiskPredictionResult {
  const point: LatLngPoint = { lat: targetLat, lng: targetLng };

  // Utility Hazard Multipliers
  const UTILITY_HAZARD_WEIGHTS: Record<UtilityType, number> = {
    gas: 1.45,
    electric: 1.35,
    water: 1.15,
    fiber: 1.05,
    sewer: 0.85,
  };

  // Method Weight
  let methodMultiplier = 1.0;
  const methodLower = excavationMethod.toLowerCase();
  if (methodLower.includes('heavy') || methodLower.includes('backhoe')) {
    methodMultiplier = 1.5;
  } else if (methodLower.includes('mini') || methodLower.includes('loader')) {
    methodMultiplier = 1.2;
  } else if (methodLower.includes('vacuum') || methodLower.includes('hydro')) {
    methodMultiplier = 0.35; // Non-destructive safe digging
  } else if (methodLower.includes('hand') || methodLower.includes('manual')) {
    methodMultiplier = 0.3; // Safest
  }

  // Soil Type Risk Multiplier
  let soilMultiplier = 1.0;
  const soilLower = soilType.toLowerCase();
  if (soilLower.includes('rock') || soilLower.includes('gravel')) {
    soilMultiplier = 1.25; // Vibration & boulder impacts
  } else if (soilLower.includes('sand')) {
    soilMultiplier = 1.15; // Cave-in risk
  } else if (soilLower.includes('clay')) {
    soilMultiplier = 0.95;
  }

  // Equipment Weight Factor
  const weightFactor = Math.min(1.4, 0.8 + equipmentWeightTons / 20);

  const utilityBreakdown: UtilityRiskDetail[] = [];
  const nearbyUtilities: UtilityItem[] = [];

  let highestUtilityRisk = 0;
  let recommendedDepth = plannedDepthMeters;

  // Process all utilities
  for (const util of allUtilities) {
    const dist = getMinimumDistanceToUtility(point, util);

    // Consider utilities within 100 meters
    if (dist <= 100) {
      nearbyUtilities.push(util);

      // Distance Decay Score (0-100): High score if very close
      // At dist = 0m -> 100, at dist = 5m -> ~60, at dist = 15m -> ~20, at 30m -> ~5
      const distanceProximityScore = 100 * Math.exp(-dist / 6.0);

      // Depth overlap factor
      // If planned depth >= util depth - 0.3m, risk spikes!
      const depthDiff = util.depthMeters - plannedDepthMeters;
      let depthOverlapFactor = 0.4;
      if (depthDiff <= 0) {
        depthOverlapFactor = 1.5; // Directly striking or deeper than utility line!
      } else if (depthDiff <= 0.4) {
        depthOverlapFactor = 1.2; // Critical danger margin
      } else if (depthDiff <= 1.0) {
        depthOverlapFactor = 0.8;
      } else {
        depthOverlapFactor = 0.4;
      }

      const hazardWeight = UTILITY_HAZARD_WEIGHTS[util.type] || 1.0;

      // Incident history factor
      const historyFactor = 1 + (util.historyIncidentCount || 0) * 0.15;

      // Compute raw utility risk score
      let rawScore =
        distanceProximityScore *
        depthOverlapFactor *
        hazardWeight *
        methodMultiplier *
        soilMultiplier *
        weightFactor *
        historyFactor;

      rawScore = Math.min(99, Math.max(5, Math.round(rawScore)));

      let level: RiskLevel = 'Low Risk';
      if (rawScore >= 70) level = 'High Risk';
      else if (rawScore >= 40) level = 'Medium Risk';

      // Damage probability %
      const damageProb = Math.min(98, Math.round(rawScore * 0.95));

      // Tailored recommendation string
      let recStr = '';
      if (level === 'High Risk') {
        recStr = `${util.type.toUpperCase()} pipeline/conduit detected ${util.depthMeters}m below surface within ${dist.toFixed(1)}m. Prohibit mechanical digging. Pothole via hydro/vacuum excavation first.`;
      } else if (level === 'Medium Risk') {
        recStr = `${util.type.toUpperCase()} line within ${dist.toFixed(1)}m at depth ${util.depthMeters}m. Proceed with hand tools and monitor line marker signals.`;
      } else {
        recStr = `${util.type.toUpperCase()} facility located safely ${dist.toFixed(1)}m away. Maintain standard excavation watch.`;
      }

      if (rawScore > highestUtilityRisk) {
        highestUtilityRisk = rawScore;
      }

      // Check if recommended depth needs cap
      if (dist <= 5.0 && util.depthMeters <= plannedDepthMeters + 0.3) {
        const safeLimit = Math.max(0.3, Math.round((util.depthMeters - 0.4) * 10) / 10);
        if (safeLimit < recommendedDepth) {
          recommendedDepth = safeLimit;
        }
      }

      utilityBreakdown.push({
        type: util.type,
        utilityName: util.name,
        utilityCode: util.code,
        nearestDistanceMeters: Math.round(dist * 10) / 10,
        utilityDepthMeters: util.depthMeters,
        riskScore: rawScore,
        riskLevel: level,
        damageProbability: damageProb,
        recommendation: recStr,
      });
    }
  }

  // Sort breakdown by highest risk first
  utilityBreakdown.sort((a, b) => b.riskScore - a.riskScore);

  // Calculate Overall Risk Score
  // Weighted blend of highest utility risk and average nearby risk
  const overallRiskScore = Math.min(
    99,
    Math.max(
      10,
      Math.round(
        highestUtilityRisk > 0
          ? highestUtilityRisk * 0.85 + (utilityBreakdown.length > 0 ? utilityBreakdown[0].riskScore * 0.15 : 0)
          : 15
      )
    )
  );

  let overallRiskLevel: RiskLevel = 'Low Risk';
  if (overallRiskScore >= 70) overallRiskLevel = 'High Risk';
  else if (overallRiskScore >= 40) overallRiskLevel = 'Medium Risk';

  // Safe buffer radius calculation
  const safeBufferRadiusMeters =
    overallRiskLevel === 'High Risk'
      ? 3.5
      : overallRiskLevel === 'Medium Risk'
      ? 2.0
      : 1.0;

  // Safety precautions list
  const safetyPrecautions: string[] = [];
  if (overallRiskLevel === 'High Risk') {
    safetyPrecautions.push('Stop heavy excavator usage immediately in proximity of flagged coordinates.');
    safetyPrecautions.push('Perform 811 / Utility One-Call locator re-verification before digging.');
    safetyPrecautions.push('Mandatory hand digging or vacuum excavation (potholing) required to visually expose utility lines.');
    safetyPrecautions.push('Station a qualified spotter at all times during bucket or blade movement.');
    safetyPrecautions.push('Keep emergency contact details for gas and electric dispatchers on active site permit.');
  } else if (overallRiskLevel === 'Medium Risk') {
    safetyPrecautions.push('Use hand tools or pneumatic vacuum equipment within 1.5 meters of marked utility paint lines.');
    safetyPrecautions.push('Verify ground markings and depth indicator signals using ground-penetrating radar (GPR).');
    safetyPrecautions.push('Monitor trench stability and implement shoring if excavating in sandy or loose soil.');
  } else {
    safetyPrecautions.push('Maintain standard PPE including high-visibility apparel, steel-toe boots, and hard hat.');
    safetyPrecautions.push('Ensure ground surface remains clear of unverified debris.');
    safetyPrecautions.push('Re-scan area if excavation path deviates by more than 2 meters from planned route.');
  }

  // Fallback natural language AI analysis summary
  const topHazard = utilityBreakdown.find((u) => u.riskLevel === 'High Risk') || utilityBreakdown[0];
  const aiAnalysisText =
    overallRiskLevel === 'High Risk'
      ? `CRITICAL EXCAVATION HAZARD DETECTED (${overallRiskScore}% Risk Index): High proximity to ${
          topHazard ? topHazard.utilityName : 'underground infrastructure'
        } (${topHazard ? topHazard.utilityDepthMeters : 1.0}m depth). Planned depth of ${plannedDepthMeters}m presents immediate strike danger. Recommended maximum initial mechanical depth is ${recommendedDepth}m. Hydro/vacuum excavation mandatory within ${safeBufferRadiusMeters}m buffer.`
      : overallRiskLevel === 'Medium Risk'
      ? `MODERATE EXCAVATION HAZARD (${overallRiskScore}% Risk Index): Subterranean utilities present within ${safeBufferRadiusMeters}m clearance zone. Careful manual potholing recommended before mechanical bucket rotation.`
      : `SAFE EXCAVATION ZONE (${overallRiskScore}% Risk Index): Planned depth of ${plannedDepthMeters}m maintains sufficient vertical and lateral clearance from surrounding underground lines. Proceed with standard site safety protocols.`;

  return {
    id: `pred-${Date.now().toString().slice(-6)}`,
    locationName,
    latitude: targetLat,
    longitude: targetLng,
    plannedDepthMeters,
    excavationMethod,
    soilType,
    equipmentWeightTons,
    overallRiskScore,
    overallRiskLevel,
    recommendedDiggingDepthMeters: recommendedDepth,
    safeBufferRadiusMeters,
    utilityBreakdown,
    safetyPrecautions,
    aiAnalysisText,
    timestamp: new Date().toISOString(),
    engineerName,
    engineerRole,
  };
}
