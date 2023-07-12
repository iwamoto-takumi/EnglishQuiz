# EnglishQuiz

英単語テストを受けることができるサイトを作成しました。
問題が出される→答えが出るというモードと、問題と4択の選択肢が表示されるというモードの2つを用意しています。

## 問題の追加方法
questionsディレクトリで、[任意の名前].tsvというファイルを作成します。csvではなくtsvですので、tabで問題と解答を区切る必要があります。また、1行目は問題のタイトルとなります。下記に一例を示します。

```tsv
Question #100-200
apple	リンゴ
banana	バナナ
circle	円
dice	さいころ
element	要素
fire	火
go	行く
```