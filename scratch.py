import re

with open('src/lib/hooks/main/usePortal.js', 'r') as f:
    content = f.read()

# Pattern to match:
# const response = await someAction(...args);
# if (!response.code) throw response;
# return response.result;
pattern = re.compile(r'const response = await ([^;]+);\s+if \(!response\.code\) throw response;\s+return response\.result;')

new_content = pattern.sub(r'return await \1;', content)

with open('src/lib/hooks/main/usePortal.js', 'w') as f:
    f.write(new_content)
