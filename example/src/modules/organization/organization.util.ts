import { organizationTypeChildrenMap, OrganizationTypeEnum } from "./organization.enum";
import { Organization } from "./organization.model";

export type OrganizationTree = Omit<Organization, "children"> & {
  children: OrganizationTree[] | null;
  hiddenChildren?: OrganizationTree[] | null;
};

export const buildTree = (data: Organization[]): OrganizationTree[] => {
  const map = new Map<string, OrganizationTree>();
  const roots: OrganizationTree[] = [];

  // init node
  for (const item of data) {
    map.set(item.id, {
      ...item,
      children: [],
      hiddenChildren: [],
    });
  }

  // build hierarchy
  for (const item of data) {
    const current = map.get(item.id)!;

    if (item.parentId) {
      const parent = map.get(item.parentId);

      if (parent) {
        parent.children?.push(current);
      } else {
        roots.push(current);
      }
    } else {
      roots.push(current);
    }
  }

  // recursive sort
  const sortTree = (nodes: OrganizationTree[]) => {
    nodes.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    for (const node of nodes) {
      if (node.children?.length) {
        sortTree(node.children);
      }
    }
  };

  sortTree(roots);

  return roots;
};

export const getAvailableOrganizationTypes = (
  parent?: Organization | null,
): OrganizationTypeEnum[] => {
  // Không có cha => chỉ được tạo tổng công ty
  if (!parent) {
    return Object.values(OrganizationTypeEnum).filter(
      (type) => type === OrganizationTypeEnum.HEADQUARTER,
    );
  }

  return organizationTypeChildrenMap[parent.type] ?? [];
};
