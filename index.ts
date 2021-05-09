import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import t from "@babel/types";

// AST に変換
const ast = parse(`
const a = 1;
const b = 5;
function sum(aNum, bNum) {
  const x = 2 + 7;
  console.log("sum", x);
  if (x === 0) {
    console.log("if break");
    return x;
  }
  return aNum + bNum;
}

console.log(sum(a, b));

function greeting(name) {
  console.log("aaa");
  return "hello, " + name;
}

console.log(greeting("satoshi"))


`);

traverse(ast, {
  FunctionDeclaration(path) {
    const funcBody = path.node.body;
    if (funcBody.body.length === 1) {
      // 1行でReturn文の場合は処理を終了する
      if (funcBody.body[0].type === "ReturnStatement") {
        return;
      }
    } else {
      let line = 0;
      path.traverse({
        Statement(path) {
          if (line === 1) {
            path.insertBefore([
              t.variableDeclaration("const", [
                t.variableDeclarator(
                  t.identifier("text"),
                  t.stringLiteral("Because I'm easy come, easy go.")
                ),
              ]),
            ]);
          }
          if (path.isReturnStatement()) {
            path.insertBefore([
              t.variableDeclaration("const", [
                t.variableDeclarator(
                  t.identifier("text"),
                  t.stringLiteral("Because I'm easy come, easy go.")
                ),
              ]),
            ]);
          }
          line++;
        },
      });
    }
  },
});

console.log(generate(ast).code);
