import type { LiveTree } from "hson-live";
import type { CssMap } from "hson-live/types";

export type CreatePkg = {
  id?: string;
  cls?: string;
  txt?: string;
  el: "div" | "span" | "section";
  css?: CssMap;
};

export const _create_pkg = (tgt: LiveTree, pkg: CreatePkg) => {
  const newTree = tgt.create.tag(pkg.el);
  newTree.id.set(pkg.id ?? "false");
  newTree.classlist.set(pkg.cls ?? "false");
  if (pkg.txt) newTree.text.set(pkg.txt);
  newTree.css.setMany(pkg.css ?? {});
  return newTree;
};

