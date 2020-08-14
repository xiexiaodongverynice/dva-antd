export function findParentFromLayout(layout, item) {
  let parent;

  switch (item.type) {
    case 'fieldSection':
      return layout.containers[0].components.filter(comp => comp.type === 'detail_form')[0];
    case 'field':
      parent = layout.containers[0].components.filter(comp => comp.type === 'detail_form')[0].field_sections;
      for (const section of parent) {
        const matchFields = section.fields.filter(f => f.field === item.id);
        if (matchFields.length > 0) return section.fields;
      }
      return null;
    case 'relatedList':
      return layout.containers[0].components;
    default:
      return null;
  }
}

export function findFromLayout(layout, item) {
  let parent;

  switch (item.type) {
    case 'fieldSection':
      parent = layout.containers[0].components.filter(comp => comp.type === 'detail_form')[0].field_sections;
      parent = parent.filter(s => s.id === item.id);
      return parent ? parent[0] : null;
    case 'field':
      parent = layout.containers[0].components.filter(comp => comp.type === 'detail_form')[0].field_sections;
      for (const section of parent) {
        const matchFields = section.fields.filter(f => f.field === item.id);
        if (matchFields.length > 0) return matchFields[0];
      }
      return null;
    case 'relatedList':
      parent = layout.containers[0].components;
      parent = parent.filter(comp => comp.ref_obj_describe === item.id);
      return parent ? parent[0] : null;
    default:
      return null;
  }
}
