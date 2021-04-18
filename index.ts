import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

// AST に変換
const ast = parse(`
const a = 1;
const b = 5;
function sum(aNum, bNum) {
  return aNum + bNum;
}

console.log(sum(a, b));

`);

console.log(JSON.stringify(ast, null, 2));

traverse(ast, {
  VariableDeclaration(path) {
    path.node.kind = "var";
  },
});

console.log("***** output *****")
console.log(generate(ast).code);
