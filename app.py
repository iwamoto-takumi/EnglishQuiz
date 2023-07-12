import os
import glob
from flask import Flask, render_template, request
 
app = Flask(__name__)

def read_tsv_files(directory):
    files = glob.glob(os.path.join(directory, "*.tsv"))
    word_pairs = {}

    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.readlines()
            title = content[0].strip()
            word_pairs[title] = [line.strip().split("\t") for line in content[1:]]

    return word_pairs

@app.route("/start_quiz", methods=["GET"])
def start_quiz():
    title = request.args.get("title")
    word_pairs = read_tsv_files("questions")
    if title not in word_pairs:
        return "Invalid quiz title.", 400
    return render_template("quiz.html", word_pairs=word_pairs, selected_title=title)

@app.route("/")
def list_quizzes():
    word_pairs = read_tsv_files("questions")
    return render_template("list_quizzes.html", word_pairs=word_pairs)

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 80)))

