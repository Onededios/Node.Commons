import { Directory, File } from '@onededios/node-commons-crate';


  constructor(relative: string) {
    const fullPath = new File(relative).getCurrentPath();
    if (!fullPath.endsWith('/'))
      throw new Error(`Path must be a directory: ${fullPath}`);
    this.fullPath = fullPath;
  }

  private findPackagesPaths(): string[] {
    const base = new Directory(this.fullPath);
    const childDirs = base.getDirs();

    const paths: string[] = [];

    childDirs.forEach((dir) => {
      const packageDir = new Directory(dir);
      if (packageDir.isChildPresent('package.json'))
        paths.push(packageDir.getCurrentPath());
    });

    return paths;
  }
