const testController = (req, res) => {

    res.send({
        success: true,
        message: 'successfully run test routes'
    })

}
module.exports = testController
