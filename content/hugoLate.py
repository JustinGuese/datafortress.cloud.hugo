from os import environ
from pathlib import Path

import yaml
from requests import get
from tqdm import tqdm

AUTHTOKEN = environ["AUTHTOKEN"]

LANGUAGE = "DE"
LANGUAGE_FOLDER = "german/"

def translate(text, targetLang):
    params = {
        "token": AUTHTOKEN,
        "tolang" : targetLang,
        "sentence" : text
    }
    if len(text) < 2000:
        resp = get("https://translate.datafortress.cloud", params=params)
        if resp.status_code != 200:
            raise Exception(f"Error {resp.status_code}: {resp.text}")
    else:
        texts = text.split("\n")
        for i,text in enumerate(texts):
            texts[i] = translate(text, targetLang)
        return "\n".join(texts)
    return resp.text.replace('"', "")


allErroredPages = []
# get all english texts
for file in tqdm(Path("english/blog/").rglob("*.md")):
    try:
        # first check if already exists
        if Path(str(file).replace("english/",LANGUAGE_FOLDER)).exists():
            print("skipping ", str(file).replace("english/",LANGUAGE_FOLDER), " because it already exists")
            continue
        else:
            Path.mkdir(Path(str(file).replace("english/",LANGUAGE_FOLDER)).parent, parents=True, exist_ok=True)
        
        with open( file, "r") as f:
            text = f.read()
        trash, header, body = text.split("---")
        # read in this yaml
        header = yaml.safe_load(header)
        header["title"] = translate(header["title"], LANGUAGE).replace('"', "")
        header["description"] = translate(header["description"], LANGUAGE).replace('"', "")
        
        # next body
        body = translate(body, LANGUAGE)
        
        with open(str(file).replace("english/",LANGUAGE_FOLDER), "w") as f:
            f.write("---\n")
            f.write(yaml.dump(header))
            f.write("---\n")
            f.write(body)
        # input("next?")
    except Exception as e:
        print("!!! Error with ", file, str(e))
        allErroredPages.append(file)
        
print("Errored pages: ", allErroredPages)
# 13it [00:04,  2.21it/s]!!! Error with  english/services/data-compliance-consultation.md
# 14it [00:34,  6.43s/it]!!! Error with  english/services/on-premise-sensitive-data-scanner.md
# 15it [00:45,  7.59s/it]!!! Error with  english/services/data-pipelines.md
# 16it [01:12, 12.17s/it]!!! Error with  english/services/_index.md
# 17it [01:14,  9.73s/it]!!! Error with  english/services/sensitive-data-scanning.md
# 18it [01:36, 12.93s/it]!!! Error with  english/services/gdpr-sql-instances.md
# 19it [02:08, 18.27s/it]!!! Error with  english/blog/pseudonymization-anonymization-guide.md
# 20it [03:54, 43.19s/it]!!! Error with  english/blog/_index.md