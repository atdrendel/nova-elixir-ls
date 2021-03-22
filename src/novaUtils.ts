import type * as lspTypes from "vscode-languageserver-protocol";

export function rangeToLspRange(document: TextDocument, range: Range) {
  const fullContents = document.getTextInRange(new Range(0, document.length));
  let chars = 0;
  let startLspRange;
  const lines = fullContents.split(document.eol);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLength = lines[lineIndex].length + document.eol.length;
    if (!startLspRange && chars + lineLength >= range.start) {
      const character = range.start - chars;
      startLspRange = { line: lineIndex, character };
    }
    if (startLspRange && chars + lineLength >= range.end) {
      const character = range.end - chars;
      return { line: lineIndex, character: character };
    }
    chars += lineLength;
  }
  return null;
}

export function lspRangeToRange(
  document: TextDocument,
  range: lspTypes.Range
): Range {
  const fullContents = document.getTextInRange(new Range(0, document.length));
  let rangeStart = 0;
  let rangeEnd = 0;
  let chars = 0;
  const lines = fullContents.split(document.eol);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLength = lines[lineIndex].length + document.eol.length;
    if (range.start.line === lineIndex) {
      rangeStart = chars + range.start.character;
    }
    if (range.end.line === lineIndex) {
      rangeEnd = chars + range.end.character;
      break;
    }
    chars += lineLength;
  }
  return new Range(rangeStart, rangeEnd);
}

export function jumpToRange(
  workspace,
  fileUri: string,
  targetRange: lspTypes.Range
) {
  nova.workspace.openFile(fileUri).then((newEditor) => {
    const range = lspRangeToRange(newEditor.document, targetRange);

    newEditor.addSelectionForRange(range);
    newEditor.scrollToPosition(range.start);
  });
}

export const makeServerExecutable = () => {
  [
    "elixir-ls-release/language_server.sh",
    "elixir-ls-release/launch.sh",
  ].forEach(function (path) {
    const process = new Process("/usr/bin/env", {
      args: ["chmod", "u+x", nova.path.join(nova.extension.path, path)],
      cwd: nova.extension.path,
    });
    process.start();
  });
};
