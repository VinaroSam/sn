'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema



const DocumentSchema = Schema({
  docUid: String,	
  docOwnerUid: String,
  docGeneratorUid : String,
  docUri: String,
  docName: String,
  docDesc: String,
  docOwnerCat : String,
  docTags : String,
  docImportant: String,
  docValide:String,
  docTraiter : String,
  docRights: String,
  docType: String,
  docSubType : String,
  docGroup : String,
  docProvider : String,
  docPrivacyLevel : String,
  docProvenanceTree : String,
  docProvQuality :String,
  docCreationDate: { type: Date, default: Date.now() },
  docLastAccess: Date,
  docGeoControl : String,
  docLang : String,
  docEncrypted : String,
  docEncAlgo : String,
  docEndLifeDate : String,
  docSigned : String
})



// docUrlid document unique resource location identifier.
// docOwnerCat : Enterprise / Person
// docType : document type : Facture
// docSubType :  TBD 
// docProvider : the one that upload the document : EDF or the person itself (user id)
// docGroup : Medical, Admin , 
// docPrivacyLevel : Standard, Private, Sensible, Confidential
// docProvenance : Ip of provider or source of document
// docProvQuality : provenance quality
// docGeoControl : region of access, yes, non, region (Europe, FR, etc)
// docEncrypted : yes / no
// docEncAlgo : Encryption algorithm 
// docEndLifeDate : end life date
// docSigned : oui/non



module.exports = mongoose.model('Document', DocumentSchema)