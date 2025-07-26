---
title: GLSL snippets
---

## Lat-long to XYZ conversion

```glsl
vec3 ll_to_xyz(vec2 ll) {
  float lon = ll.x;
  float lat = ll.y;
  return vec3(cos(lon) * cos(lat), sin(lon) * cos(lat), sin(lat)  );
}
```

```glsl
vec2 xyz_to_ll(vec3 v) {
  float x = v.x, y = v.y, z = v.z;
  return vec2(asin(z), atan(y, x));
}
```

## Rotate spherical coordinates

```glsl
vec2 rotll(vec2 l, float theta, float phi) {
  float lat = l.y;
  float lon = l.x;
  return vec2(
    atan(sin(lon), tan(lat) * sin(theta) + cos(lon) * cos(theta)) - phi,
    asin(cos(theta) * sin(lat) - cos(lon) * sin(theta) * cos(lat))
  );
}
```
