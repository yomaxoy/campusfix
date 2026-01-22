import { categories } from '../data/categories';

/**
 * Übersetzt eine issueType ID in das entsprechende deutsche Label
 * @param issueTypeId - Die ID des Issue-Types (z.B. 'screen', 'battery')
 * @param categoryId - Die ID der Kategorie (z.B. 'tech', 'mobility')
 * @param subcategoryId - Die ID der Subkategorie (z.B. 'smartphone', 'laptop')
 * @returns Das deutsche Label oder die ID als Fallback
 */
export function getIssueTypeLabel(
  issueTypeId: string,
  categoryId?: string,
  subcategoryId?: string
): string {
  // Wenn Kategorie und Subkategorie angegeben sind, direkt suchen
  if (categoryId && subcategoryId) {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const subcategory = category.subcategories.find((s) => s.id === subcategoryId);
      if (subcategory) {
        const issue = subcategory.issues.find((i) => i.id === issueTypeId);
        if (issue) {
          return issue.label;
        }
      }
    }
  }

  // Fallback: Durchsuche alle Kategorien
  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      const issue = subcategory.issues.find((i) => i.id === issueTypeId);
      if (issue) {
        return issue.label;
      }
    }
  }

  // Letzer Fallback: Gib die ID zurück
  return issueTypeId;
}
