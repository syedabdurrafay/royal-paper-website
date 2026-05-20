import re

with open('src/body_content.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove script tags completely
text = re.sub(r'<script>.*?</script>', '', text, flags=re.DOTALL)

# Convert class= to className=
text = text.replace('class=', 'className=')
text = text.replace('onclick=', 'onClick=')
text = text.replace('for=', 'htmlFor=')

# Fix self-closing tags
text = re.sub(r'<input([^>]*)>', r'<input\1 />', text)
text = re.sub(r'<br>', r'<br />', text)
text = re.sub(r'<hr>', r'<hr />', text)

# Convert HTML comments
text = re.sub(r'<\s*!--(.*?)-->', r'{/* \1 */}', text, flags=re.DOTALL)

# Convert basic inline styles
def style_replacer(match):
    style_str = match.group(1)
    rules = []
    for rule in style_str.split(';'):
        if ':' in rule:
            k, v = rule.split(':', 1)
            k = k.strip()
            v = v.strip()
            parts = k.split('-')
            k_camel = parts[0] + ''.join(p.title() for p in parts[1:])
            rules.append(f'{k_camel}: "{v}"')
    return 'style={{ ' + ', '.join(rules) + ' }}'

text = re.sub(r'style="(.*?)"', style_replacer, text)

# Add fragment
with open('src/Main.jsx', 'w', encoding='utf-8') as f:
    f.write('export default function Main() {\n  return (\n    <>\n')
    f.write(text)
    f.write('\n    </>\n  );\n}\n')
