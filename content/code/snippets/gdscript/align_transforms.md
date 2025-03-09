
# Align transforms

## Teleport/portal between transforms

You have Node3D A, and two Transform3Ds B and C. You want to "teleport" A from
B to C, such that the relative orientation and position of A to B becomes its
relative orientation and position of A to C.

```
# Compute the transform from B to A.
var t := B.global_transform.affine_inverse() * A.global_transform

# Apply that transform to C, assigning the result to A.
A.global_transform = C.global_transform * t
```

## Align exactly

Suppose you have a Node3D A with a Node3D child B, and an unrelated Node3D C.

You want to transform A so that B's transform matches C's.

```
A.global_transform = C.global_transform * B.transform.affine_inverse()
```

## Align flipped

If you want to align B and C but with B "pointing the other way" - e.g. B and C
are attachment points on two models - rotate B's transform around an axis
perpendicular to the axis B and C are meeting on.

e.g. If B and C attach on the Z axis, you could rotate B around the Y axis.

```
A.global_transform = (
  C.global_transform *
  B.transform.rotated_local(Vector3.UP, PI).affine_inverse()
)
```
