private func uploadAvatar(username:String, image: UIImage) {
        let newSize = CGSize(width: 150, height: 150)
        imagebody = compressImage(image, newSize: newSize, percent: 0.5)
        let imageString = imagebody.base64EncodedStringWithOptions(NSDataBase64EncodingOptions.Encoding64CharacterLineLength)
        print("imagestring is \(imageString)")
        let dataString = NSString.localizedStringWithFormat("{\"username\":\"%@\",\"imagebody\":\"%@\"}",username,imageString)
        let sent = NSData(data: dataString.dataUsingEncoding(NSASCIIStringEncoding)!)
        let dataLength = NSString.localizedStringWithFormat("%ld", sent.length)
        let path = usefulConstants().domainAddress + "/addUserSmallImage"
        let url = NSURL(string: path)
        print("login request address: \(path)\n")
        let request = NSMutableURLRequest()
        request.URL = url
        request.HTTPMethod = "POST"
        request.setValue(dataLength as String, forHTTPHeaderField: "Content-Length")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.HTTPBody = sent
        indicator.alpha = 1
        indicator.startAnimating()
        
        let conn = NSURLConnection(request: request, delegate: self, startImmediately: true)

        if (conn == nil) {
            let alertController = UIAlertController(title: "Warning",
                                                    message: "Connection Failure.", preferredStyle: .Alert)
            let okAction = UIAlertAction(title: "OK", style: .Default, handler: nil)
            alertController.addAction(okAction)
            self.presentViewController(alertController, animated: true, completion: nil)
        }

    }