from flask import Flask,render_template

app=Flask(__name__)

@app.route('/game',methods=['post'])
def start():
    return render_template('demo.html')

@app.route('/')
def first():
    return render_template('first_page.html')


if __name__=="__main__":
    app.run(debug=True,host='192.168.202.100',port=5000)