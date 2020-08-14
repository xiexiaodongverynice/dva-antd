// 19/01/2018 - TAG: 复制时需要从布局对象中移除的属性
export const omitProps = [
  "tenant_id",
  "create_time",
  "version",
  "create_by",
  "update_time",
  "is_deleted",
  "id",
  "update_by",
  "is_active", // 复制后的布局默认应该是非激活状态，所以应该去掉此属性
];
