type OdooOperator =
  | '='
  | '!='
  | 'in'
  | 'not in'
  | 'ilike'
  | 'like'
  | '>'
  | '<'
  | '>='
  | '<=';

type OdooLeaf = [field: string, op: OdooOperator | 'in' | 'not in', value: any];
type OdooDomain = Array<'&' | '|' | '!' | OdooLeaf>;

const orPrefix = (leaves: OdooLeaf[]): OdooDomain => {
  if (leaves.length === 0) return [];
  if (leaves.length === 1) return leaves;
  const ors = Array(leaves.length - 1).fill('|') as Array<'|'>;
  return [...ors, ...leaves];
};

export function buildOdooFilterDomain(
  values: Array<string | number>,
  field: string = 'stage_id',
  op: OdooOperator = '=',
): OdooDomain {
  if (!values?.length) return [];

  switch (op) {
    case '=': {
      // OR entre iguales → se compacta a IN
      return values.length === 1
        ? [[field, '=', values[0]]]
        : [[field, 'in', values]];
    }
    case '!=': {
      // AND entre distintos → se compacta a NOT IN
      return values.length === 1
        ? [[field, '!=', values[0]]]
        : [[field, 'not in', values]];
    }
    case 'in': {
      // Siempre una sola hoja
      return [[field, 'in', values]];
    }
    case 'not in': {
      // Siempre una sola hoja
      return [[field, 'not in', values]];
    }
    case 'like':
    case 'ilike': {
      // OR prefijo de múltiples patrones
      const leaves: OdooLeaf[] = values.map((v) => [field, op, v]);
      return orPrefix(leaves);
    }
    case '>':
    case '>=': {
      // Monótono: AND de varios ">" equivale a tomar el máximo
      const nums = values.map(Number).filter((n) => !Number.isNaN(n));
      if (!nums.length) return [];
      const max = Math.max(...nums);
      return [[field, op, max]];
    }
    case '<':
    case '<=': {
      // Monótono: AND de varios "<" equivale a tomar el mínimo
      const nums = values.map(Number).filter((n) => !Number.isNaN(n));
      if (!nums.length) return [];
      const min = Math.min(...nums);
      return [[field, op, min]];
    }
    default: {
      // Fallback defensivo (no debería ocurrir por el tipo)
      const leaves: OdooLeaf[] = values.map((v) => [field, op, v]);
      return orPrefix(leaves);
    }
  }
}
