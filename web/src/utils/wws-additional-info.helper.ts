import { AppProduct } from '../types/app-product.interface.ts';

export function parseNutritionalInfo(nipJson: string): AppProduct['nutritionalInfo'] | undefined {
  if (!nipJson) return undefined;
  
  try {
    const nip = JSON.parse(nipJson);
    const per100g: Record<string, string> = {};
    const perServing: Record<string, string> = {};
    let servingSize = '';
    let servingsPerPack = '';

    nip.Attributes.forEach((attr: any) => {
      if (attr.Name.includes('Per 100g')) {
        const name = attr.Name.replace(' Quantity Per 100g - Total - NIP', '').toLowerCase();
        per100g[name] = attr.Value;
      } else if (attr.Name.includes('Per Serve')) {
        const name = attr.Name.replace(' Quantity Per Serve - Total - NIP', '').toLowerCase();
        perServing[name] = attr.Value;
      } else if (attr.Name === 'Serving Size - Total - NIP') {
        servingSize = attr.Value;
      } else if (attr.Name === 'Servings Per Pack - Total - NIP') {
        servingsPerPack = attr.Value;
      }
    });

    return {
      servingSize,
      servingsPerPack,
      per100g,
      perServing
    };
  } catch (e) {
    console.error('Error parsing nutritional information:', e);
    return undefined;
  }
}

export function parseAllergens(
  containsStr: string | null, 
  mayContainStr: string | null
): AppProduct['allergens'] | undefined {
  const allergens: AppProduct['allergens'] = {
    contains: [],
    mayContain: []
  };

  if (containsStr) {
    allergens.contains = containsStr.split(',').map(a => a.trim());
  }

  if (mayContainStr) {
    allergens.mayContain = mayContainStr.split(',').map(a => a.trim());
  }

  return allergens.contains.length || allergens.mayContain.length ? allergens : undefined;
}