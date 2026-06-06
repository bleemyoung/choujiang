import fs from 'node:fs';
import path from 'node:path';

const DEFAULTS = {
  start: 5200001,
  end: 5200700,
  department: '无',
  requiredPrize: '',
  fixedNames: ['5200007', '5200052', '5200680', '5200112', '5200100',
    '5200500', '5200555', '5200320', '5200167', '5200289',
    '5200461', '5200111', '5200290', '5200078', '5200009', '5200056'
  ],
  fixedPrize: '惊喜礼品',
  banned: '否',
  weight: '1',
  out: 'import_5200001_5200700.csv',
};

const HEADER = ['姓名', '部门', '必中奖项(奖项名称)', '禁止中奖(是/否)', '权重(1-10)'];

function parseArgs(argv) {
  const options = { ...DEFAULTS };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    const [rawKey, inlineValue] = arg.slice(2).split('=', 2);
    const value = inlineValue ?? argv[index + 1];

    if (inlineValue === undefined) {
      index += 1;
    }

    if (value === undefined || value.startsWith('--')) {
      throw new Error(`Missing value for --${rawKey}`);
    }

    switch (rawKey) {
      case 'start':
      case 'end':
        options[rawKey] = Number(value);
        break;
      case 'department':
      case 'requiredPrize':
      case 'fixedPrize':
      case 'banned':
      case 'weight':
      case 'out':
        options[rawKey] = value;
        break;
      case 'fixedNames':
        options.fixedNames = value.split(',').map((item) => item.trim()).filter(Boolean);
        break;
      default:
        throw new Error(`Unknown option: --${rawKey}`);
    }
  }

  return options;
}

function assertOptions(options) {
  if (!Number.isInteger(options.start) || !Number.isInteger(options.end)) {
    throw new Error('--start and --end must be integers');
  }

  if (options.start > options.end) {
    throw new Error('--start must be less than or equal to --end');
  }

  if (!options.out) {
    throw new Error('--out cannot be empty');
  }

  if (options.fixedNames.length > 0 && !options.fixedPrize) {
    throw new Error('--fixedPrize cannot be empty when --fixedNames is set');
  }
}

function escapeCsvCell(value) {
  const text = String(value);

  if (!/[",\r\n]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

function createCsv(options) {
  const lines = [HEADER.join(',')];
  const fixedNameSet = new Set(options.fixedNames.map(String));

  for (let name = options.start; name <= options.end; name += 1) {
    const nameText = String(name);
    const requiredPrize = fixedNameSet.has(nameText) ? options.fixedPrize : options.requiredPrize;

    lines.push(
      [
        nameText,
        options.department,
        requiredPrize,
        options.banned,
        options.weight,
      ].map(escapeCsvCell).join(','),
    );
  }

  return `${lines.join('\r\n')}\r\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  assertOptions(options);

  const outPath = path.resolve(options.out);
  const csv = createCsv(options);

  fs.writeFileSync(outPath, `\uFEFF${csv}`, 'utf8');
  console.log(`Generated ${options.end - options.start + 1} rows: ${outPath}`);
}

main();
