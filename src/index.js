import React from 'react';
import ReactDOM from 'react-dom';
import {PaginationLink,PaginationItem} from 'reactstrap'
// import Modal from 'react-modal'
import {Modal,Button,Table,FormGroup,FormControl,Col,ControlLabel,Pagination} from 'react-bootstrap'

import './index.css';
var axios=require('axios');
var hobbies=[],totalPages=0;
class Home extends React.Component{
    constructor(){
        super()
        this.state={
            data1:[],
            state1:[],
            city1:[],
            editData:[],
            currentData:[],
            isEditing:false,
            isActive:false,
            previewFile:'',
            photo:'',
            hobby:[],
            currState:'',
            currStateid:'',
            currCity:[],
            curr:1,
            totalRecords:5,
            editid:'',
            searchArr:[],
            isSearch:false,
            isDeactive:false,
            oldimagevalue:""


        }
    };
    mypage=(no)=>{

        this.setState({
            curr:no
        })
    }
    handleEntry=(e)=>{
        // alert(e.target.value);
        this.setState({
            totalRecords:e.target.value
        })
        // alert(this.state.totalRecords);
    }
    clearData=()=>{
        this.state.editData=[];
        this.state.currentData=[];

        this.setState({currentData:[]},()=>{
            console.log('Edit Data : ',this.state.editData)
            console.log('Current Data : ',this.state.currentData)

        })


    }
    componentWillMount(){

        this.list();
        this.statelist();
        this.citylist();
    }

    statelist=()=>{
        axios.get('http://localhost:8585/statelist').then((success)=>{
            this.setState({
                state1:success.data
            })
            console.log("State : ",this.state.state1);
        })
    }
    handleCity=(e)=>{
       // alert(e.target.value)
        this.state.currCity=[];
        const stateid=this.state.currentData.state;
        //alert(stateid);
        this.state.state1.map((st,i)=>{
            if(st._id===stateid)
            {
                console.log("State Id",st._id);
                console.log("State Id",st.statename);
                this.setState({
                   currState:st.statename,
                    currStateid:st._id
                },()=>{
                    this.state.city1.map((ct,i)=>{

                       // console.log("State Id",s.statename);
                        if(ct.stateid===this.state.currStateid)
                        {
                            console.log("city",ct);
                            let {currCity}=this.state
                            currCity.push(ct)
                            this.setState({currCity})
                            console.log("CuurrrCity",this.state.currCity);
                        }
                    })
                })
            }
        })

    }
    citylist=()=>{
        axios.get('http://localhost:8585/citylist').then((success)=>{
            this.setState({
                city1:success.data
            })
            console.log("City : ",this.state.city1);
        })
    }
    handleChange=(event)=>{
        console.log('fullname : ',event.target.value);
        const {value, name} = event.target;
        const editData = this.state.editData;
        editData[name] = value;
        this.setState({editData}, () => {
            console.log(this.state.editData1);
        });

        console.log('control : ',event.target.value);
        const currentData=this.state.currentData;
        currentData[name]=value;
        this.setState({currentData}, () => {
            console.log(this.state.currentData.state);
            // console.log(this.state.currentData.city);

        });
    }
    handleChangeC=(e)=>{
        hobbies.push(e.target.value+" , ");
        this.setState({
            hobby:hobbies
        })
    }

    handleUploadFile = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        //console.log('file',file);

        reader.onloadend = () => {
            this.setState({
                photo:file,
                previewFile: reader.result,

            });
        };
        reader.readAsDataURL(file);
        console.log(`File Upload : ${this.state.previewFile}`);



    }
    toggleActive=()=>{
        this.setState({

            isActive:!this.state.isActive
        })

    }


    list=()=>{
        axios.get('http://localhost:8585/list').then((success)=>{
            this.setState({
                data1:success.data
            })
            console.log("Student Data : ",this.state.data1)
        })
    }
    sendData=(e)=> {
        e.preventDefault();
      //  this.toggleActive();
        axios.post('http://localhost:8585/add', {
            photo: this.state.previewFile,
            hobby: this.state.hobby,
            ...this.state.currentData
        }).then((success) => {
            this.state.data1.push(success.data);
            this.setState({
                data1: this.state.data1
            })
            this.clearData();
            this.toggleActive();
        })
        console.log("New Daata : ", this.state.data1);
        this.clearData();
    }
    updateData=(e)=> {
        e.preventDefault();

        axios.post('http://localhost:8585/update', {
            photo: this.state.previewFile,
            id:this.state.editid,
            ...this.state.editData
        }).then((success) => {

            this.setState({
                data1: this.state.data1,
                editid:false,
                isEditing:false
            })
            this.clearData();
            this.toggleActive();
        })
        console.log("New Daata : ", this.state.data1);
        this.clearData();
    }
    delete=(sid)=>{
        axios.post('http://localhost:8585/delete',{
            id:sid

        }).then((success)=>{
            console.log("Delete : ",success.data);

            var dt=this.state.data1.filter((d)=>success.data['_id']!==d._id);
            this.setState({
                data1:dt
            });

            // var dt=this.state.data1.splice(success.data,1);
            // this.setState({
            //     data1:this.state.data1
            // })
            // console.log("Splice ," ,dt);
            // console.log("data ," ,this.state.data1);
            // console.log("Dt ",dt)
        })
        console.log("New Daata : ",this.state.data1);
    }

    sort=(e)=>{



        var key=e.target.id;
        console.log(key);
        var myData = [].concat(this.state.data1)
            .sort((a, b) => a[key] > b[key]);

        this.setState({
            data1:myData
        })
        console.log('sorted : ',this.state.data1);

    }
    dsort=(e)=>{



        var key=e.target.id;
        console.log(key);
        var myData = [].concat(this.state.data1)
            .sort((a, b) => a[key] > b[key]);

        this.setState({
            data1:myData.reverse()
        })
        console.log('sorted : ',this.state.data1);

    }

    search=(e)=>{
        e.preventDefault();
        var key=e.target.value;
        this.setState({
            isSearch:true,
            searchArr:[]
        })

       var temp=[];
        this.state.data1.map((st,index)=>{
            if(st.name.includes(key))
            {
                temp.push(st);
            }
            else if(st.email.includes(key))
            {
                temp.push(st);
            }
            else if(st.gender.includes(key))
            {
                temp.push(st);
            }
            if(key==="")
            {
                this.setState({
                    isSearch:false
                })
            }
            this.setState({
                searchArr:temp
            })

            console.log('Search Data ',this.state.searchArr)
        })
    }


    ggg=()=>{

        this.clearData();
        this.toggleActive();

    }
    render(){
        console.log("render,",this.state.editData)
        const editData=this.state.editData;
        const isEditing=this.state.isEditing;
        const isSearch=this.state.isSearch;
        const searchArr=this.state.searchArr;
        console.log("IsEditing ",isEditing);
        console.log("Search ",searchArr);
        var pages=[];

        var lastrec=this.state.curr*this.state.totalRecords;
        var firstrec=lastrec-this.state.totalRecords;
        var totrec=this.state.data1.slice(firstrec,lastrec);
        var len=this.state.data1.length

            totalPages=Math.ceil(len/this.state.totalRecords);

            for(let i=1;i<=totalPages;i++)
            {
                pages.push(i);
            }
        return(
            <section>


                <div id="main">
                    <div className="col-lg-12">
                        <center><h1>Student Mangement System</h1></center>
                    </div>
                    <div className="col-lg-12 row">
                        <div className="col-lg-2">
                            <select className="form-control" onChange={this.handleEntry}>
                                <option value="5">5</option>
                                <option value="3">3</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                        <div className="col-lg-5 offset-1">
                            <input type="text" onChange={this.search} placeholder="Search Here" className="form-control"/>
                        </div>
                        <div className="col-lg-3">
                            <button type="button" className="btn btn-primary" onClick={this.toggleActive}>
                               Add
                            </button>
                        </div>
                        <br/>
                    </div>

                    <div>
                        <Table hover >
                            <thead>
                            <th>Name
                                <a id="name" onClick={this.sort}>&#9650;</a>
                                <a id="name" onClick={this.dsort}>&#9660;</a>

                            </th>
                            <th>Age
                                <a id="age" onClick={this.sort}>&#9650;</a>
                                <a id="age" onClick={this.dsort}>&#9660;</a>

                            </th>
                            <th>Email
                                <a id="email" onClick={this.sort}>&#9650;</a>
                                <a id="email" onClick={this.dsort}>&#9660;</a>
                            </th>
                            <th>Conatct
                                <a id="contact" onClick={this.sort}>&#9650;</a>
                                <a id="contact" onClick={this.dsort}>&#9660;</a>
                            </th>
                            <th>Gender</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Photo</th>
                            <th colSpan="2">Action</th>
                            </thead>
                            <tbody>

                            {
                                isSearch?
                                    searchArr.map((s,index)=>{
                                        return(
                                            <tr>
                                                <td>{s.name}</td>
                                                <td>{s.age}</td>
                                                <td>{s.email}</td>
                                                <td>{s.contact}</td>
                                                <td>{s.gender}</td>
                                                <td>

                                                    {
                                                        this.state.city1.map((c,i)=>{
                                                            if(s.city===c._id){
                                                                return c.cityname
                                                            }
                                                        })
                                                    }

                                                </td>
                                                <td>
                                                    {
                                                        this.state.state1.map((s1,i)=>{
                                                            if(s.state===s1._id){
                                                                return s1.statename
                                                            }
                                                        })
                                                    }

                                                </td>
                                                <td><img src={s.photo} height="50px" width="50px"/></td>
                                                <td>
                                                    <a className="fa fa-trash" onClick={()=>{this.delete(s._id)}}/>
                                                </td>
                                                <td>
                                                    <button  onClick={()=>{
                                                        console.log(s);
                                                        this.setState({
                                                            editData:s,
                                                            isEditing:true,
                                                            editid:s._id,

                                                        },()=>{
                                                            console.log(this.state.editData);
                                                            this.toggleActive();

                                                        })


                                                    }}>Edit</button>
                                                </td>

                                            </tr>
                                        )
                                    })
                                    :
                                totrec.map((s,index)=>{
                                    return(
                                        <tr>
                                            <td>{s.name}</td>
                                            <td>{s.age}</td>
                                            <td>{s.email}</td>
                                            <td>{s.contact}</td>
                                            <td>{s.gender}</td>
                                            <td>

                                                {
                                                    this.state.city1.map((c,i)=>{
                                                        if(s.city===c._id){
                                                            return c.cityname
                                                        }
                                                    })
                                                }

                                            </td>
                                            <td>
                                                {
                                                    this.state.state1.map((s1,i)=>{
                                                        if(s.state===s1._id){
                                                            return s1.statename
                                                        }
                                                    })
                                                }

                                            </td>
                                            <td><img src={s.photo} height="50px" width="50px"/></td>
                                            <td>
                                                <a className="fa fa-trash" onClick={()=>{this.delete(s._id)}}/>
                                            </td>
                                            <td>
                                                <button  onClick={()=>{
                                                    console.log(s);
                                                    this.setState({
                                                        editData:s,
                                                        isEditing:true,
                                                        editid:s._id,

                                                    },()=>{
                                                        console.log(this.state.editData);
                                                        this.toggleActive();

                                                    })


                                                }}>Edit</button>
                                            </td>

                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </div>
                    <div className="col-lg-10 row">
                        <div className="col-lg-5 offset-5">
                            <Pagination bsSize="large">
                            {
                                pages.map((p,i)=>{
                                    return(<li onClick={()=>{this.mypage(p)}}><center><Pagination.Item>{p}</Pagination.Item></center></li>)
                                })
                            }
                            </Pagination>

                        </div>
                    </div>
                </div>

                <Modal show={this.state.isActive} onHide={this.ggg}>{
                    console.log(this.state.editData)}
                    <Modal.Header >
                        <Modal.Title>Student System</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.sendData}>

                        <div className="form-group row" >
                        <label className="col-sm-2 col-form-label">Name<span>*</span></label>
                        <div className="col-sm-10">
                        <input className="form-control" type="text" value={editData.name} onChange={this.handleChange} name="name" id="txtfname" required={true}/>
                        </div>
                        </div>
                        <div className="form-group row" >
                        <label className="col-sm-2 col-form-label">Age<span>*</span></label>
                        <div className="col-sm-10">
                        <input className="form-control" type="text" value={editData.age} onChange={this.handleChange} name="age" id="txtfname" required={true}/>
                        </div>
                        </div>
                        <div className="form-group row" >
                        <label className="col-sm-2 col-form-label">Email<span>*</span></label>
                        <div className="col-sm-10">
                        <input className="form-control" type="email" value={editData.email} onChange={this.handleChange} name="email" id="txtfname" required={true}/>
                        </div>
                        </div>
                        <div className="form-group row" >
                        <label className="col-sm-2 col-form-label">Contact<span>*</span></label>
                        <div className="col-sm-10">
                        <input className="form-control" type="text" value={editData.contact} onChange={this.handleChange} name="contact" id="txtfname" required={true}/>
                        </div>
                        </div>
                        <div className="form-group row" >
                        <label className="col-sm-2 col-form-label">Gender<span>*</span></label>
                        <div className="col-sm-10">
                        <label className="radio-inline"><input type="radio" name="gender" checked={editData.gender==="F"?true:false} value="F" onChange={this.handleChange}/>Female</label>
                        <label className="radio-inline"><input type="radio" name="gender" checked={editData.gender==="M"?true:false} value="M" onChange={this.handleChange}/>Male</label>
                        </div>
                        </div>
                        {/*<div className="form-group row">*/}
                        {/*<label className="col-sm-2 col-form-label">Hobby<span>*</span></label>*/}

                        {/*<div className="form-check form-check-inline">*/}
                        {/*<label className="form-check-label">*/}
                        {/*<input type="checkbox" className="form-check-input" value="Reading" onChange={(e)=>this.handleChangeC(e)}/>Reading*/}
                        {/*</label>*/}
                        {/*</div>*/}
                        {/*<div className="form-check form-check-inline">*/}
                        {/*<label className="form-check-label">*/}
                        {/*<input type="checkbox" className="form-check-input" value="Dancing" onChange={(e)=>this.handleChangeC(e)} />Dancing*/}
                        {/*</label>*/}
                        {/*</div>*/}
                        {/*<div className="form-check form-check-inline disabled">*/}
                        {/*<label className="form-check-label">*/}
                        {/*<input type="checkbox" className="form-check-input" value="Cooking" onChange={(e)=>this.handleChangeC(e)} />Cooking*/}
                        {/*</label>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        <div className="form-group row" >
                        <label className="col-sm-2 col-form-label">State<span>*</span></label>
                        <div className="col-sm-10">
                        <select className="form-control" value={editData.state} onChange={(e)=>
                            {this.handleChange(e);
                            this.handleCity(e)
                            }} name="state">
                            {
                            this.state.state1.map((st,index)=>{
                            return(
                            <option value={st._id}>{st.statename}</option>
                            )
                            })
                            }
                        </select>
                        </div>
                        </div>
                        <div className="form-group row" >
                        <label className="col-sm-2 col-form-label">City<span>*</span></label>
                        <div className="col-sm-10">
                        <select className="form-control" value={editData.city} onChange={this.handleChange} name="city">
                        {
                            this.state.currCity.map((c,i)=>{

                            return <option value={c._id}>{c.cityname}</option>


                            })
                        }
                        </select>

                        </div>
                        </div>
                        <div className="form-group row" >
                            <img src={editData.photo} height="50px" width="50px"/>
                            <label className="col-sm-2 col-form-label">Photo<span>*</span></label>
                            <div className="col-sm-10">
                            <input className="form-control" type="file" onChange={this.handleUploadFile} name="firstname" id="txtfname" required={true}/>
                        </div>
                        </div>
                        <div className="form-group row" >
                        <label className="col-sm-2 col-form-label"></label>
                        <div className="col-sm-10">
                            {isEditing ?
                                    <input  onClick={this.updateData} type="submit" className="btn btn-primary" value="Update"/>

                                    :
                                    <input  type="submit" className="btn btn-primary" value="Insert"/>

                            }
                        </div>
                        </div>

                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.ggg}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </section>

        )
    }

}

ReactDOM.render(<Home />, document.getElementById('root'));

