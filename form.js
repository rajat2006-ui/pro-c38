class Form{
    constructor(){
        this.input=createInput("name")
        this.button=createButton('play')
    }

    hide(){
        this.input.hide()
        this.button.hide()
    }

    display(){
        gameState="getName"
        this.input.position(500,400)
        this.button.position(550,450)

        this.button.mousePressed(()=>{
            gameState=1
            this.input.hide()
            this.button.hide()
            var playerName=this.input.value()
            database.ref('/').update({
                name:playerName
            })
            
        })
    }
}