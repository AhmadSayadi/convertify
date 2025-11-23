# Convertify - Developer Tools for Data Conversion

![Convertify Logo](public/logo.svg)

**Convert anything. Faster. Smarter.**

A web-based platform for converting and manipulating data in various formats: CSV, JSON, SQL, Excel, and more. Designed for developers, data engineers, and analysts who need fast, accurate, and practical conversion tools in one dashboard.

## 🚀 Features

### Data Conversion Tools
- **CSV → SQL** - Convert CSV data to SQL INSERT statements
- **SQL → CSV** - Convert SQL queries to CSV format
- **JSON → SQL** - Convert JSON objects to SQL INSERT statements
- **SQL → JSON** - Convert SQL data to JSON format
- **Excel → CSV** - Convert Excel spreadsheets to CSV format
- **CSV ↔ JSON** - Bidirectional conversion between CSV and JSON

### SQL Tools
- **SQL Formatter** - Format and beautify SQL queries
- **SQL → Schema** - Extract database schema from SQL statements
- **Schema → SQL** - Generate SQL CREATE TABLE from schema
- **SQL IN Converter** - Convert lists to SQL IN clauses (supports multiple delimiters)
- **Text to SQL CREATE** - Generate SQL CREATE TABLE from column names

### Text & Encoding Tools
- **URL Encode/Decode** - Encode and decode URL strings
- **Base64 Encode/Decode** - Encode and decode Base64 strings
- **Slug Generator** - Generate URL-friendly slugs from text
- **Convert Case** - Convert text to different cases (camelCase, snake_case, etc.)
- **Character Detector** - Detect invisible and special characters in text

### Utilities
- **UUID Generator** - Generate random UUIDs (v4)
- **JSON Formatter** - Format and validate JSON data
- **Timestamp Converter** - Convert Unix timestamps to readable dates
- **Date Converter** - Convert between different date formats
- **ENV Converter** - Convert between ENV file formats
- **HTML Table Converter** - Convert tables to/from HTML
- **Log Parser** - Parse and analyze log files
- **JSON to Table** - Convert JSON to HTML tables
- **Diff Checker** - Compare two texts and find differences

## 🎨 Key Features

### ✨ User Experience
- **Side-by-Side Layout** - Input and output displayed simultaneously for easy comparison
- **Dark Mode Support** - Comfortable viewing in any lighting condition
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Collapsible Sidebar** - Maximize workspace with collapsible navigation
- **Search Functionality** - Quickly find the tool you need
- **URL Routing** - Each tool has its own URL for easy bookmarking and sharing

### 🌍 Internationalization
- **Bilingual Support** - Available in English and Indonesian
- **Language Persistence** - Your language preference is saved

### 💾 Data Persistence
- **LocalStorage** - Preferences saved locally (theme, language, sidebar state)
- **No Server Required** - All processing happens in your browser
- **Privacy First** - Your data never leaves your device

### 🎯 Developer Friendly
- **Copy to Clipboard** - One-click copy for all outputs
- **Download Results** - Export converted data as files
- **Multiple Delimiters** - Support for various input formats (newline, space, comma)
- **Error Handling** - Clear error messages for invalid inputs
- **Real-time Conversion** - Instant results as you type

## 🛠️ Tech Stack

- **React 18** - Modern React with Hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Context API** - State management for theme and language

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

1. Clone the repository
```bash
git clone https://github.com/AhmadSayadi/convertify
cd convertify
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🎯 Usage Examples

### CSV to SQL
```
Input (CSV):
id,name,email
1,John Doe,john@example.com
2,Jane Smith,jane@example.com

Output (SQL):
INSERT INTO table_name (id, name, email) VALUES
(1, 'John Doe', 'john@example.com'),
(2, 'Jane Smith', 'jane@example.com');
```

### JSON Formatter
```
Input:
{"name":"John","age":30,"city":"New York"}

Output:
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

### Base64 Encode
```
Input:
Hello World!

Output:
SGVsbG8gV29ybGQh
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Bug Reports

If you find a bug, please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 💡 Feature Requests

Have an idea for a new conversion tool? Open an issue with the `enhancement` label!

## 📧 Contact

- Website: [https://convertify.ahmadsayadi.com](https://convertify.ahmadsayadi.com)
- GitHub: [@AhmadSayadi](https://github.com/AhmadSayadi/convertify)
- Email: [me@ahmadsayadi.com](mailto:me@ahmadsayadi.com)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspired by modern developer tools
- Built with ❤️ for developers

---

**Made with ❤️ by developers, for developers**

Convert anything. Faster. Smarter. 🚀
