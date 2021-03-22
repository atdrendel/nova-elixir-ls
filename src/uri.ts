export const folderPath = (uri: string, workspacePath: string) => {
  const workspaceRelativePath = uri.split(workspacePath).pop();

  // Remove the "/" from the start and the file name from the end.
  return workspaceRelativePath.split("/").slice(1, -1).join("/") + "/";
};

export const fileName = (uri: string) => uri.split("/").pop();

export const filePath = (uri: string) => {
  const normalized = nova.path.normalize(uri);
  const split = nova.path.split(normalized);
  if ("file:" === split[0] && "Volumes" === split[1]) {
    const joined = nova.path.join(...split.slice(3));
    const path = "file:///" + joined;
    return path;
  } else {
    return uri;
  }
};
