class WarningRouter{

    warningConsumers = []

    pushWarning(message){
        this.warningConsumers.forEach(func => {
            try{
                func(message);
            }catch(e){

            }
        })
    }

    addConsumer(func){
        this.warningConsumers.push(func);
    }
}

const router = new WarningRouter();

export default router;