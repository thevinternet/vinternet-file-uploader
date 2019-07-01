# Vinternet Drag & Drop File Uploader
An HTML file uploader which provides both a traditional file upload experience using the HTML input as well as drag and drop functionality. The solution is built with accessibility in mind and employs client side validation to the file size and file type uploaded which can be customised on the HTML input element directly.

## Requirements

* [NodeJS][nodejs] 6.0.0 and above
* [PugJS][pug] templating knowledge

## Setup & Usage

* To install, clone from GitHub and run `npm install` in the cloned directory
* Once install is complete, run `gulp local`
* Browse to http://localhost:5000 to view application in your chosen browser

## Configuration

You can configure client side validation rules for the file size by changing the `data-file-size` attribute of the HTML file input to your desired value in bytes e.g `data-file-size="2097152"`.

You can configure client side validation rules for the file types by changing the `accept` attribute of the HTML file input to your desired string of file extension e.g. `accept=".jpeg, .png"`.

## Browser Support

This application performs as expected across all evergreen browsers (Firefox, Chrome, Edge, Safari, etc) and will work correctly in versions of Internet Explorer 10 and above.

## Contributing
If you wish to submit a bug fix or feature, you can create a pull request and it will be merged pending a code review.

1. Fork the repository
1. Create your feature branch (`git checkout -b my-new-feature`)
1. Commit your changes (`git commit -am 'Add some feature'`)
1. Push to the branch (`git push origin my-new-feature`)
1. Create a new Pull Request

[nodejs]: http://nodejs.org
[pug]: https://pugjs.org/
