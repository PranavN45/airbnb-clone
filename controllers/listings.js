const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = "pk.eyJ1IjoicHJhbmF2bmFsYXdhZGUiLCJhIjoiY2x4bnluY29jMDA2YzJxcXluYWoxaG9kZCJ9.98ZTUSB10ma47LSO6X8vlg";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index =  async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", 
            populate: { path: "author", },
        }).populate("owner");
    if(!listing) {
        req.flash("error", "Listing Your Requested For Does Not Exist !");
        res.redirect("/listings") 
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
    consolq.log(req.user._id);
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; 
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let geoData = await newListing.save();
    // consolq.log(req.user._id);
    console.log(geoData);
    req.flash("success", "New Listing Created!"); 
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing Your Requested For Does Not Exist !");
        res.redirect("/listings") 
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_scale,h_250,w_370/");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Updated Listing !"); 
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted Listing !"); 
    res.redirect("/listings");
};