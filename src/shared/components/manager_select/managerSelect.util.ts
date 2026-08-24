export function buildTree<T extends { id: string; parentId?: string | null; name: string }>(
  data: T[],
) {
  const map = new Map<string, { key: string; value: string; title: string; children: any[] }>();

  data.forEach((item) => {
    map.set(item.id, {
      key: item.id,
      value: item.id,
      title: item.name,
      children: [],
    });
  });

  const tree: any[] = [];
  data.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) map.get(item.parentId)!.children.push(node);
    else tree.push(node);
  });

  return tree;
}

