import json

with open('metadata.json', 'r') as f:
    data = json.load(f)

data['name'] = 'The Rolling Wars'

with open('metadata.json', 'w') as f:
    json.dump(data, f, indent=2)
