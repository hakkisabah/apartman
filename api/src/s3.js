const AWS = require("aws-sdk");
const { Item } = require("../models/item");
// require('dotenv').config() // if need on development
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACC_KEY,
  secretAccessKey: process.env.AWS_ACC_SECRET_KEY,
});
const params = {
  Bucket: process.env.AWS_BUCKET_NAME,
  Body: "",
  ACL: "public-read",
  Key: "",
};

const upload = async (fileparams, cb) => {
  await s3.upload(fileparams, (err, data) => {
    if (err) return cb(err, null);
    return cb(null, data.Location);
  });
};

const uploadfile = async (req, res) => {
  const sampleFile = req.files.file;
  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    sampleFile.mimetype !== process.env.ACCEPT_MIMETYPE
  ) {
    return res
      .status(500)
      .json({ error: "No files were uploaded or wrong file extension" });
  }

  params.Body = Buffer.from(sampleFile.data, "binary");
  params.Key = `${process.env.UPLOAD_FOLDER}${req.body.giderTuru}-${req.body.donem}-${req.body.sene}.pdf`;
  return await upload(params, (err, data) => {
    if (err) return { error: "Upload failed", reason: err };
    return { location: data };
  });
};

const getItems = () => {
  return new Promise((resolve) => {
    const getObjectparams = {};
    Object.assign(getObjectparams, params);
    delete getObjectparams.Body;
    delete getObjectparams.ACL;
    getObjectparams.Key = `${process.env.UPLOAD_FOLDER}${process.env.ITEMS_FILE_NAME}.json`;
    s3.getObject(getObjectparams, function (err, data) {
      if (err && err.statusCode === 404) {
        resolve([]);
      } else {
        const items = JSON.parse(Buffer.from(data.Body).toString())
          .sort((a, b) => +b.donem - +a.donem)
          .sort((a, b) => +b.sene - +a.sene);
        resolve(items);
      }
    });
  });
};

exports.getItems = getItems;

const addItem = async (req, res) => {
  const gettedItems = await getItems();
  const itm = new Item(gettedItems);
  await uploadfile(req, res);
  const { donem, sene, giderTuru, tutar } = req.body;
  const items = itm.addItem(
    itm.createInvoice({ donem, sene, giderTuru, tutar })
  );
  params.Body = JSON.stringify(items);
  params.Key = `${process.env.UPLOAD_FOLDER}${process.env.ITEMS_FILE_NAME}.json`;
  await upload(params, (err) => {
    if (err)
      return res.status(500).json({ error: "Upload failed", reason: err });
    return res.status(200).json(items);
  });
};

exports.addItem = addItem;

const updateItem = async (req, res) => {
  const gettedItems = await getItems();
  const itm = new Item(gettedItems);
  const { sampleFile, ...allItemProp } = req.body;
  if (sampleFile !== "") {
    // every time check and if file exists upload it
    await uploadfile(req, res);
  }
  const items = itm.updateItem(allItemProp);
  params.Body = JSON.stringify(items);
  params.Key = `${process.env.UPLOAD_FOLDER}${process.env.ITEMS_FILE_NAME}.json`;
  await upload(params, (err) => {
    if (err)
      return res.status(500).json({ error: "Upload failed", reason: err });
    return res.status(200).json(items);
  });
};

exports.updateItem = updateItem;

const deleteItem = async (req, res) => {
  try {
    const gettedItems = await getItems();
    const itm = new Item(gettedItems);
    const { invoiceId } = req.body;
    const item = itm.deleteItem(invoiceId);
    const getObjectparams = {};
    Object.assign(getObjectparams, params);
    delete getObjectparams.Body;
    delete getObjectparams.ACL;
    getObjectparams.Key = `${process.env.UPLOAD_FOLDER}${item[0].giderTuru}-${item[0].donem}-${item[0].sene}.pdf`;
    s3.deleteObject(getObjectparams, async (err, data) => {
      if (!err) {
        params.Body = JSON.stringify(itm.items);
        params.Key = `${process.env.UPLOAD_FOLDER}${process.env.ITEMS_FILE_NAME}.json`;
        await upload(params, (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "After delete update failed", reason: err });
          return res.status(200).json(itm.items);
        });
      } else {
        return res.status(500).json({ error: "Delete failed", reason: err });
      }
    });
  } catch (e) {
    return res.status(500).json({ error: "Delete failed", reason: e });
  }
};
exports.deleteItem = deleteItem;
