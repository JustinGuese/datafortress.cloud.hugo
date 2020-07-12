FOR /R %f IN (*.jpg) DO magick mogrify -verbose -resize "1200x1200>" "%f"
FOR /R %f IN (*.png) DO magick mogrify -verbose -resize "1200x1200>" "%f"

