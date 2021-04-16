import mongoose from 'mongoose';

export default class Server {
    port: number;
    app: any;

    constructor(port: number ,app: any){
        this.port = port;
        this.app = app;
    }

    core() {
        mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@farhan01.yzaff.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
            { useNewUrlParser: true , useUnifiedTopology: true }

        )
            .then(() => {
                this.app.listen(this.port,(err: any) => {
                    if(err) console.log(err);
                    else console.log(`http://localhost:${this.port}/graphql`);
                });
            })
            .catch(error => {
              console.log(error);
        });

    }
}