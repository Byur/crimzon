/**
 * @todo sometimes you can reset an Object type param which is used for list_query request by this function
 * @param {{attrA:"xxx",attrB:"xxx"}} object
 * @param {['keya','keyb']} unexcept
 */
export default function resetForm(object, unexcept) {
  for (let i in object) {
    // 如果有不期望置空的属性,跳过该轮循环
    if (unexcept.indexOf(i) !== -1) {
      continue;
    } else {
      object[i] = "";
    }
  }
  return object;
}
