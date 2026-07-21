/** Types for the Human Authority Gate modal (ARC C2 safety-critical authorisation). */

export interface RoeRule {
  id: string;
  label: string;
}

export interface HumanAuthorityGate {
  id: string;
  title: string;
  taskType: string;
  target: { label: string; sub: string };
  classification: { label: string; confidence: number };
  effector: { label: string; sub: string };
  predictedIntercept: { label: string; sub: string };
  targetRange: { label: string; sub: string };
  rationale: string;
  policyId: string;
  authoriser: string;
  auditSink: string;
  roeRules: RoeRule[];
}

export interface AuthoriseRecord {
  gateId: string;
  confirmedRules: string[];
  timestamp: string;
  operator: string;
  target: string;
  confidence: number;
}
