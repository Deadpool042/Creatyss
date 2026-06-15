const ARCHIVED_MARKER = "__archived__";
const RESTORED_MARKER = "__restored__";
const MAX_AUTOMATION_CODE_LENGTH = 64;

function trimCodeBase(base: string, suffix: string): string {
  return base.slice(0, Math.max(MAX_AUTOMATION_CODE_LENGTH - suffix.length, 0));
}

export function buildArchivedAutomationCode(code: string, automationId: string): string {
  const suffix = `${ARCHIVED_MARKER}${automationId.slice(-8)}`;
  return `${trimCodeBase(code, suffix)}${suffix}`;
}

export function restoreOriginalAutomationCode(code: string): string {
  const markerIndex = code.indexOf(ARCHIVED_MARKER);
  return markerIndex >= 0 ? code.slice(0, markerIndex) : code;
}

export function buildRestoredAutomationCode(code: string, automationId: string): string {
  const baseCode = restoreOriginalAutomationCode(code);
  const suffix = `${RESTORED_MARKER}${automationId.slice(-6)}`;
  return `${trimCodeBase(baseCode, suffix)}${suffix}`;
}
