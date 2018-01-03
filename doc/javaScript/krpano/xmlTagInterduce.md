# 标签介绍

## preview标签

定义一个当全景图片还未加载完毕时的一个小的预览图片。这个预览图片一定要小（文件小，分辨率小），以更快的加载出来。

|属性名  |属性全名     |类型    |默认值  |
|:---   |:---        |:---   |:---   |
|url    |preview.url |String |       |

## view标签

view标签包含了当前视图的相关信息。
在xml中，它可以用来设置启动视图的配置。
观看方向将通过hlookat和vlookat属性来配置，以及fov的设置。

```xml
    <view
        hlookat="0.0"
        vlookat="0.0"
        fov="90.0"
        fovmin="1.0"
        fovmax="179.0"
        maxpixelzoom=""
    />
```

<table border=1>
<tr>
    <th>属性名</th>
    <th>属性全名</th>
    <th>类型</th>
    <th>默认值</th>
</tr>
<tr>
    <td>hlookat</td>
    <td>view.hlookat</td>
    <td>Number</td>
    <td>0.0</td>
</tr>
<tr>
    <td colspan=4>
    球面坐标的水平方向。典型的范围从-180到180.view本身不会值不会环绕360.值0.0只想pano图像的中心
    </td>
</tr>

<tr>
    <td>vlookat</td>
    <td>view.vlookat</td>
    <td>Number</td>
    <td>0.0</td>
</tr>
<tr>
    <td colspan=4>
    球面坐标的垂直方向。典型的范围从-90到90.
    </td>
</tr>

<tr>
    <td>fov</td>
    <td>view.fov</td>
    <td>Number</td>
    <td>90.0</td>
</tr>
<tr>
    <td colspan=4>
    0.0-179.0
    </td>
</tr>

<tr>
    <td>fovmin</td>
    <td>view.fovmin</td>
    <td>Number</td>
    <td>1.0</td>
</tr>
<tr>
    <td colspan=4>
    最小的fov值，这将在pano中限制缩放
    </td>
</tr>

<tr>
    <td>fovmax</td>
    <td>view.fovmax</td>
    <td>Number</td>
    <td>179.0</td>
</tr>
<tr>
    <td colspan=4>
    最大的fov值，这将在pano外限制缩放
    </td>
</tr>
<tr>
    <td>maxpixelzoom</td>
    <td>view.maxpixelzoom</td>
    <td>Number</td>
    <td></td>
</tr>
<tr>
    <td colspan=4>
    pano图像的最大像素放大因子。这将根据pano的分辨率和当前的查看窗口（比如，1.0 = 限制为100%缩放）来限制fov，而源图像的像素缩放将不可见。
    </td>
</tr>
</table>
