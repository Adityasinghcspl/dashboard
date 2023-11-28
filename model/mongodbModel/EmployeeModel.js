var mongoose = require('mongoose');
var Schemas = require('../MongodbSchema');

class EmployeeModel {
    /*-----------------------here create new dashboard name --------------------------*/
    
    async allEmployee() {
        let Employee = new mongoose.model('Employee', Schemas.EmployeeSchema);
        let result = await Employee.find().then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
        return result;
    }

    async createEmployee(dataObject) {
        let Employee = new mongoose.model('Employee', Schemas.EmployeeSchema);
        let result = await Employee.create(dataObject).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
        return result;
    }

    async findEmployeeByID(id){
        let Employee = new mongoose.model('Employee', Schemas.EmployeeSchema);
        let result = await Employee.find({ _id:id}).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
        return result;
    }

    async findEmployeeByEmail(email) {
        try {
            let Employee = new mongoose.model('Employee', Schemas.EmployeeSchema);
            const result = await Employee.findOne({ email });
            return result;
        } catch (err) {
            return err;
        }
    }

    async upEmployee(id,data){
        let Employee = new mongoose.model('Employee', Schemas.EmployeeSchema);

        let result = await Employee.findByIdAndUpdate(id,data, { new: true }).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        });
        return result;
    }

    async deleteEmployeetData(id){
        let Employee = new mongoose.model('Employee', Schemas.EmployeeSchema);
        let result = await Employee.deleteOne({ _id: id }).then((res)=>{
            return res;
        }).catch((err)=>{
            return err;
        })
        return result;
    }
}

module.exports = new EmployeeModel();