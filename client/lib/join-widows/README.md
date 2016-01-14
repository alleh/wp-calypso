Join Widows
===========

This module fixes those annoying words that trail on their own at the start of a new line.

It takes a text string and returns an array of the text including a non breaking space before the last word.

# Usage

`widow( 'widows can get remarried' )`

outputs

`
[ 'widows ', 'can ', 'get', { <span>&nbsp;</span>}, 'remarried' ]
`

# Notes

We have to return the &nbsp; as an object otherwise React esapes it.
