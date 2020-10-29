import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeUserResults,mergeAssignmentResults,mergeServiceHistoryResults,mergePensionEmployeeResults } from "../utils/search";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import some from "lodash/some";
import { actions } from "../utils/search";
import { validatePensionNotificationRegisterSearchModel } from "../utils/modelValidation";
import envVariables from "../envVariables";
import mdmsData from "../utils/mdmsData";
import filter from "lodash/filter";
const asyncHandler = require("express-async-handler");

export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/userAuth",
    asyncHandler(async (request, res, next) => {       
      //console.log(request.body.RequestInfo);
      let successStatus = false;
      let userName = request.body.userName;
      let password = request.body.password;
     
     let text ="SELECT user_name, password FROM tbl_user where active = true and user_name ='" + userName+"'";
      
    
      let sqlQuery = text;      
      //console.log(sqlQuery);
      let users=[];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {        
          users =
              dbRes.rows && !isEmpty(dbRes.rows)
                ? await mergeUserResults(
                    dbRes.rows,
                    request.query,
                    request.body
                  )
                : [];  
          
                successStatus = true;
          let authenticate = false;
          let userName = "";
          
          if(users[0].password==password){
            authenticate=true;
            userName = users[0].userName;
          }

          let response = {
            AuthenticationStatus:authenticate,
            UserName:userName,
            SuccessStatus:successStatus
          };                                
          res.json(response);          
        }  
      });    
      
    })
  );
  return api;
};
