export type ReleaseGate = {
  gate: string;
  evidence: string;
  status: string;
};

export function parseReleaseGates(markdown: string): ReleaseGate[] {
  const lines = markdown.split(/\r?\n/);
  const gates: ReleaseGate[] = [];
  let inRequiredGates = false;
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      inRequiredGates = /^## Required Gates\s*$/.test(line);
      inTable = false;
      continue;
    }

    if (!inRequiredGates) {
      continue;
    }

    if (!line.startsWith('|')) {
      if (inTable) {
        break;
      }
      continue;
    }

    inTable = true;
    if (/^\|\s*-+/.test(line) || /^\|\s*Gate\s*\|/.test(line)) {
      continue;
    }

    const cells = splitMarkdownTableRow(line);
    if (cells.length < 3) {
      continue;
    }

    gates.push({
      gate: stripInlineMarkdown(cells[0]),
      evidence: stripInlineMarkdown(cells[1]),
      status: stripInlineMarkdown(cells[2]),
    });
  }

  return gates;
}

export function summarizeGateStatuses(gates: ReleaseGate[]): { pending: number; local: number } {
  return gates.reduce(
    (summary, gate) => {
      if (/pending/i.test(gate.status)) {
        summary.pending += 1;
      } else {
        summary.local += 1;
      }
      return summary;
    },
    { pending: 0, local: 0 },
  );
}

export function statusClass(status: string): string {
  if (/pending/i.test(status)) {
    return 'status-pending';
  }
  if (/release receipt/i.test(status)) {
    return 'status-mixed';
  }
  return 'status-local';
}

function splitMarkdownTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells: string[] = [];
  let current = '';
  let escaped = false;

  for (const char of trimmed) {
    if (char === '|' && !escaped) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
    escaped = char === '\\' && !escaped;
    if (char !== '\\') {
      escaped = false;
    }
  }

  cells.push(current.trim());
  return cells;
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]/g, '')
    .replaceAll(String.fromCodePoint(0xa0), ' ')
    .trim();
}
