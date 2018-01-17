lynx --dump \
https://www.fsf.org/blogs/community/\
user-liberation-watch-and-share-our-new-video | \
grep vtt | awk '{ print "wget "  $2}'  | sh