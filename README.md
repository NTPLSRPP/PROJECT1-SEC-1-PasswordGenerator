# PROJECT1-SEC-1-Password Generator Application

### [Click Here to view live version of our project](https://int203-project-password-secure.vercel.app/)

## Group member

---

- **Chanakarn Kruehong | 65130500013**
  - **Task**: Password Generator Implementation, Copy to clipboard feature, Password Generator Strength UI, Password Checker UI
  - **Responsibility**: 25%
- **Nathaphat Lertsiriphongphan | 65130500020**
  - **Task**: Password History Implementation, Generate Password Logic, Reactivity on Password Checker Component, Password Checker Strength UI
  - **Responsibility**: 25%
- **Pornchai Kaewkrabil | 65130500047**
  - **Task**: Password Checker UI, Switch Tab, Wireframe, Reactivity on Password Checker Component, Drawer Component
  - **Responsibility**: 25%
- **Pattaradanai Srichon | 65130500057**
  - **Task**: Password Checker Logic, Theme Controller, Animation, Password Checker Strength Reactivity 
  - **Responsibility**: 25%
### Project Document

---

This project is the part of INT203 Client-side subject. It's feature two main functionality: a Password Generator and a Password Checker. The Password Generator allows users to create secure, customized passwords based on selected criteria, while the Password Checker evaluates the strength of entered passwords against common security standards.

### [Click here to watch a video introducing the functions password-Generator App](https://youtu.be/yXNG2cSGcBs?si=fs1HhXYg5C5vH6Cy)

#### Features

- **Password Generator:** Generates password base on selected options. (length, symbols, numbers, lowercase, uppercase).
- **Password Checker:** Evaluates password strength and provides feedback on improvements.
- **Dark Mode:** Using local storages to store user's preferences themes.
- **Password Generated History:** User can view the generated password in the drawer tab.

#### Tools

- Vue.js
- Tailwind CSS
- Daisy UI

#### Video Showcase
PLACE HOLDER

#### External Tool

- Natural Language Toolkit (ntlk lib)

##### Usage

The code here used to generate a JSON dictionary with first 10000 most frequently used words.

```python
import nltk
import json

nltk.download('words')
nltk.download('brown')

from nltk.corpus import brown

from nltk.probability import FreqDist

def get_frequent_words(corpus, num_words=100):
    # Extract words from the corpus
    words = [word.lower() for word in corpus.words()]
    # Calculate word frequencies
    fdist = FreqDist(words)
    # Get the most common words
    common_words = [word for word, _ in fdist.most_common(num_words)]
    filtered_words = [word for word in common_words if word.isalpha()]

    return filtered_words

# Export
common_words = get_frequent_words(brown, 10000)
json_words = json.dumps(common_words)

with open('words.json', 'w') as f:
    f.write(json_words)
```
