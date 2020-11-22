import get from "lodash/get";
import findIndex from "lodash/findIndex";
import isEmpty from "lodash/isEmpty";
import { httpRequest } from "./api";
import envVariables from "../envVariables";
import userService from "../services/userService";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";
import { convertDateToEpoch} from "../utils";
import {encrypt,decrypt} from "../utils/encryption";

let requestInfo = {};

export const intConversion = string => {
  return string ? parseInt(string) : null;
};

export const floatConversion = string => {
  return string ? parseFloat(string) : null;
};

export const booleanConversion = string => {
  return string ? ((string==="true")?true:false): null;
};

export const mergeUserResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let user = {};        
    user = await userRowMapper(response[i]);
    result.push(user);
  }  
  return result;
};

const userRowMapper = async (row, mapper = {}) => {
  let user = isEmpty(mapper) ? {} : mapper;
  user.userName =row.user_name;
  user.password = row.password; 
  return user;
};

export const mergeCountryResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let country = {};        
    country = await countryRowMapper(response[i]);
    result.push(country);
  }  
  return result;
};

const countryRowMapper = async (row, mapper = {}) => {
  let country = isEmpty(mapper) ? {} : mapper;
  country.countryId =row.country_id;
  country.code = row.code; 
  country.name = row.name; 
  return country;
};

export const mergeFundingAgencyResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let fundingAgency = {};        
    fundingAgency = await fundingAgencyRowMapper(response[i]);
    result.push(fundingAgency);
  }  
  return result;
};

const fundingAgencyRowMapper = async (row, mapper = {}) => {
  let fundingAgency = isEmpty(mapper) ? {} : mapper;
  fundingAgency.fundingAgencyId =row.funding_agency_id;
  fundingAgency.code = row.code; 
  fundingAgency.name = row.name; 
  return fundingAgency;
};

export const mergeSubSBUResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let subSBU = {};        
    subSBU = await subSBURowMapper(response[i]);
    result.push(subSBU);
  }  
  return result;
};

const subSBURowMapper = async (row, mapper = {}) => {
  let subSBU = isEmpty(mapper) ? {} : mapper;
  subSBU.subSBUId =row.sub_sbu_id;
  subSBU.code = row.code; 
  subSBU.name = row.name; 
  return subSBU;
};

export const mergeBlockResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let block = {};        
    block = await blockRowMapper(response[i]);
    result.push(block);
  }  
  return result;
};

const blockRowMapper = async (row, mapper = {}) => {
  let block = isEmpty(mapper) ? {} : mapper;
  block.blockId =row.block_id;
  block.blockName = row.block_name; 
  return block;
};

export const mergeProjectTypeResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let projectType = {};        
    projectType = await projectTypeRowMapper(response[i]);
    result.push(projectType);
  }  
  return result;
};

const projectTypeRowMapper = async (row, mapper = {}) => {
  let projectType = isEmpty(mapper) ? {} : mapper;
  projectType.projectTypeId =row.project_type_id;
  projectType.code = row.code; 
  projectType.name = row.name; 
  return projectType;
};

export const mergeMasterDataResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let masterData = {};        
    masterData = await masterDataRowMapper(response[i]);
    result.push(masterData);
  }  
  return result;
};

const masterDataRowMapper = async (row, mapper = {}) => {
  let masterData = isEmpty(mapper) ? {} : mapper;
  masterData.valueId =row.value_id;
  masterData.name = row.name; 
  masterData.description = row.description; 
  return masterData;
};

export const mergeApplicationDataResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let applicationData = {};        
    applicationData = await applicationDataRowMapper(response[i]);
    result.push(applicationData);
  }  
  return result;
};

const applicationDataRowMapper = async (row, mapper = {}) => {
  let applicationData = isEmpty(mapper) ? {} : mapper;
  applicationData.applicationNumber = row.application_number;
  applicationData.applicantName = row.applicant_name;
  applicationData.mobile = decrypt(row.mobile); 
  return applicationData;
};

export const mergeProjectDataResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let projectData = {};        
    projectData = await projectDataRowMapper(response[i]);
    result.push(projectData);
  }  
  return result;
};

const projectDataRowMapper = async (row, mapper = {}) => {
  let projectData = isEmpty(mapper) ? {} : mapper;
  projectData.projectId = row.project_id;
  projectData.projectName = row.project_name;
  projectData.clientName = row.client_name;
  projectData.projectStartDate = row.project_start_date; 
  projectData.projectEndDate = row.project_end_date; 
  projectData.projectValue = row.project_value; 
  projectData.currency = row.currency;
  projectData.region = row.region;
  projectData.country = row.country;
  projectData.funding_agency = row.funding_agency;
  projectData.projectType = row.project_type;
  projectData.isNetworkFirmOpportunity = row.is_network_firm_opportunity;
  projectData.pwcIndiaValue = row.pwc_india_value;
  projectData.subSbuName = row.sub_sbu_name;
 /* projectData.nodeId =row.node_id;
  projectData.documentId =row.document_id;
  projectData.documentName =row.document_name;
  projectData.documentType =row.document_type;*/
  return projectData;

};

export const mergeDocumentResults = async (response, query = {}, reqInfo) => {
  requestInfo = reqInfo;
  let result = [];
  for (var i = 0; i < response.length; i++) {
    let documents = {};        
    documents = await documentRowMapper(response[i]);
    result.push(documents);
  }  
  return result;
};

const documentRowMapper = async (row, mapper = {}) => {
  let documents = isEmpty(mapper) ? {} : mapper;
  documents.nodeId =row.node_id;
  documents.documentId = row.document_id; 
  documents.documentName = row.document_name; 
  documents.documentType = row.document_type;
  return documents;
};
