# Markdown 语法全面测试文档

这是一篇用于测试 **Markdown Notes** 应用渲染能力的复杂文档。它涵盖了标准 Markdown 语法、扩展语法、代码高亮、表格、数学公式等多种元素。

---

## 1. 文本格式化

### 1.1 基础样式

普通文本、**粗体文本**、*斜体文本*、***粗斜体文本***、~~删除线文本~~。

行内代码：`console.log("Hello World")` 和 `pip install numpy`。

### 1.2 混合样式

这是一个包含 **粗体**、*斜体*、`代码` 和 [链接](https://github.com) 的复杂段落。我们还可以有 ***粗斜体中的 `代码`***。

> **注意**：这是一个引用块，里面可以包含 **粗体**、*斜体* 和 `代码`。
> 
> 多行引用块的第二行。

---

## 2. 标题层级测试

### 2.1 三级标题

#### 2.1.1 四级标题

##### 2.1.1.1 五级标题

###### 2.1.1.1.1 六级标题

---

## 3. 列表测试

### 3.1 无序列表

- 第一项
  - 嵌套项 1.1
    - 嵌套项 1.1.1
    - 嵌套项 1.1.2
  - 嵌套项 1.2
- 第二项
  - 嵌套项 2.1
- 第三项

### 3.2 有序列表

1. 第一步：安装依赖
   1. 安装 Node.js
   2. 安装 pnpm
2. 第二步：克隆仓库
   ```bash
   git clone https://github.com/lidaixingchen/markdown-notes.git
   ```
3. 第三步：启动开发服务器
   ```bash
   pnpm install
   pnpm dev
   ```
4. 第四步：构建生产版本

### 3.3 任务列表

- [x] 已完成：项目初始化
- [x] 已完成：三栏布局
- [x] 已完成：Markdown 渲染
- [ ] 待办：云端同步
- [ ] 待办：移动端适配

---

## 4. 代码块高亮测试

### 4.1 TypeScript / Vue

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note } from '../types/note'

const STORAGE_KEY = 'markdown-notes'

export const useNoteStore = defineStore('notes', () => {
  const notes = ref<Note[]>(loadNotes())
  const searchQuery = ref('')
  const selectedTag = ref<string | null>(null)

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    notes.value.forEach((n) => n.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet)
  })

  function addNote(title: string, content: string, tags: string[] = []) {
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
    }
    notes.value.unshift(note)
    saveNotes(notes.value)
    activeNoteId.value = note.id
    return note
  }

  return { notes, allTags, addNote }
})
```

### 4.2 Python

```python
import asyncio
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Note:
    id: str
    title: str
    content: str
    tags: List[str]
    created_at: str

class NoteRepository:
    def __init__(self, storage_key: str = "markdown-notes"):
        self.storage_key = storage_key
        self._notes: List[Note] = []
    
    async def load(self) -> List[Note]:
        """异步加载笔记数据"""
        await asyncio.sleep(0.1)  # 模拟 IO 延迟
        # 实际实现中这里会读取 localStorage 或数据库
        return self._notes
    
    def search(self, query: str) -> List[Note]:
        """搜索笔记"""
        q = query.lower()
        return [
            n for n in self._notes
            if q in n.title.lower() or q in n.content.lower()
        ]
    
    def filter_by_tag(self, tag: str) -> List[Note]:
        """按标签筛选"""
        return [n for n in self._notes if tag in n.tags]

# 使用示例
async def main():
    repo = NoteRepository()
    notes = await repo.load()
    print(f"Loaded {len(notes)} notes")

if __name__ == "__main__":
    asyncio.run(main())
```

### 4.3 Rust

```rust
use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Note {
    pub id: String,
    pub title: String,
    pub content: String,
    pub tags: Vec<String>,
    pub created_at: String,
}

pub struct NoteStore {
    notes: HashMap<String, Note>,
    storage_key: String,
}

impl NoteStore {
    pub fn new(storage_key: &str) -> Self {
        Self {
            notes: HashMap::new(),
            storage_key: storage_key.to_string(),
        }
    }

    pub fn add(&mut self, note: Note) {
        self.notes.insert(note.id.clone(), note);
        self.persist();
    }

    pub fn get(&self, id: &str) -> Option<&Note> {
        self.notes.get(id)
    }

    pub fn search(&self, query: &str) -> Vec<&Note> {
        let q = query.to_lowercase();
        self.notes
            .values()
            .filter(|n| {
                n.title.to_lowercase().contains(&q)
                    || n.content.to_lowercase().contains(&q)
            })
            .collect()
    }

    fn persist(&self) {
        // 序列化到 localStorage
        if let Ok(json) = serde_json::to_string(&self.notes) {
            // web_sys::storage().set_item(&self.storage_key, &json)
        }
    }
}
```

### 4.4 SQL

```sql
-- 创建笔记表
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建全文搜索索引
CREATE INDEX idx_notes_search ON notes USING gin(to_tsvector('chinese', title || ' ' || content));

-- 按标签筛选
SELECT * FROM notes 
WHERE tags @> ARRAY['vue', 'typescript']
ORDER BY created_at DESC;

-- 搜索笔记
SELECT * FROM notes 
WHERE to_tsvector('chinese', title || ' ' || content) @@ plainto_tsquery('chinese', 'markdown');
```

### 4.5 CSS / Tailwind

```css
/* Neobrutalism Design System */
:root {
  --color-primary: #FDC800;
  --color-secondary: #432DD7;
  --color-surface: #FBFBF9;
  --color-text: #1C293C;
  --border-width: 2px;
  --shadow-offset: 4px;
}

.neobrutalism-button {
  background: var(--color-primary);
  border: var(--border-width) solid var(--color-text);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-text);
  padding: 0.5rem 1rem;
  font-weight: 700;
  transition: all 0.15s ease;
}

.neobrutalism-button:hover {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 var(--color-text);
}

.neobrutalism-button:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
```

### 4.6 JSON / YAML

```json
{
  "name": "markdown-notes",
  "version": "1.0.0",
  "description": "A neobrutalism-styled markdown note-taking app",
  "dependencies": {
    "vue": "^3.5.0",
    "pinia": "^3.0.0",
    "marked": "^18.0.0",
    "highlight.js": "^11.11.0",
    "html2pdf.js": "^0.14.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
```

---

## 5. 表格测试

### 5.1 基础表格

| 功能 | 状态 | 优先级 | 备注 |
|------|------|--------|------|
| 创建笔记 | ✅ 已完成 | P0 | 核心功能 |
| 编辑笔记 | ✅ 已完成 | P0 | 实时保存 |
| 删除笔记 | ✅ 已完成 | P0 | 带确认对话框 |
| 标签管理 | ✅ 已完成 | P1 | 支持多标签 |
| 搜索过滤 | ✅ 已完成 | P1 | 标题+内容 |
| Markdown 导入 | ✅ 已完成 | P1 | 拖拽+按钮 |
| Markdown 导出 | ✅ 已完成 | P1 | 下载 .md 文件 |
| PDF 导出 | ✅ 已完成 | P2 | 使用 html2pdf.js |
| 云端同步 | ⏳ 待开发 | P2 | 未来版本 |
| 移动端适配 | ⏳ 待开发 | P3 | 响应式布局 |

### 5.2 对齐表格

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容 1 | 内容 2 | 内容 3 |
| 长内容示例 | 中等长度 | 短 |
| Vue | React | Svelte |

---

## 6. 链接与图片

### 6.1 各种链接

- 外部链接：[GitHub](https://github.com)
- 带标题链接：[Vue.js 官方文档](https://vuejs.org "Vue.js 文档")
- 自动链接：<https://github.com/lidaixingchen/markdown-notes>
- 邮箱链接：<lidaixingchen@example.com>

### 6.2 图片

![Vue.js Logo](https://vuejs.org/images/logo.png)

> 注意：如果图片无法加载，会显示 alt 文本。

---

## 7. 分隔线与特殊元素

### 7.1 水平分隔线

---

***

___

### 7.2 脚注

这是一个带有脚注的句子[^1]。

[^1]: 这是脚注的内容，可以包含 `代码` 和 **粗体**。

---

## 8. HTML 内嵌

<details>
<summary>点击展开详情</summary>

这是折叠内容，可以包含：

- **列表项**
- `代码`
- 其他 Markdown 元素

</details>

---

## 9. 复杂嵌套结构

> ### 引用块中的标题
>
> 引用块中的段落，包含 **粗体** 和 `代码`。
>
> - 引用块中的列表项 1
> - 引用块中的列表项 2
>   - 嵌套列表项
>
> ```javascript
> // 引用块中的代码块
> const message = "Hello from blockquote!";
> console.log(message);
> ```

1. 有序列表项
   > 列表项中的引用块
   > 多行引用
2. 另一个列表项
   ```python
   # 列表项中的代码块
   def hello():
       return "World"
   ```

---

## 10. 长文本与换行

这是一段很长的文本，用于测试文本换行和段落渲染。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

这是第二段。Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

---

## 11. 表情符号与特殊字符

🎉 📝 ✨ 🚀 💡 🔥 ⭐

特殊字符：© ® ™ § ¶ † ‡

数学符号：× ÷ ± ∞ ≈ ≠ ≤ ≥

箭头：← ↑ → ↓ ↔ ↕

---

## 12. 结语

这篇测试文档涵盖了 Markdown 的主要语法元素。通过导入此文件到 **Markdown Notes** 应用中，可以全面测试：

1. **渲染引擎**（marked）的解析能力
2. **代码高亮**（highlight.js）的语法支持
3. **样式系统**（neobrutalism）的视觉效果
4. **布局系统**（三栏布局）的内容适应性

> **提示**：你可以将这篇文档拖拽到应用窗口中导入，或使用"导入"按钮选择此文件。

[^1]: 这是脚注的内容，可以包含 `代码` 和 **粗体**。
