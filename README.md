# MakerBoard

MakerBoard is utility and emulation for development boards, it supports `MediaTek LinkIt Smart 7688` and `MediaTek LinkIt Smart 7688 Duo` currently.

This project supported by __MakerCup Community__, visit [LinkIt-7688 Channel](https://gitter.im/MakerCup/linkit-7688) for more discussions.

## Installation

MakerBoard can only be running on Linux. It depends on qemu and utilities which you need to install first.

__For Debian/Ubuntu:__
```bash
sudo apt-get install qemu-user-static unsquashfs 
```

To make sure you have Node.js already, then install MakerBoard globally via NPM:
```bash
npm install makerboard -g
```

## Usage

The `makerboard` utility can be used once you installed it.

### Create an Emulation

Create a folder and prepare an emulation environment in it:
```bash
makerboard create my7688
```

If you want to create emulation environment by using own rootfs image, you can execute with option `-i`:
```bash
makerboard create my7688 -i /opt/foo/rootfs.squashfs
```

### Run an Emulation Environment

With `run` command, we can run and enter to specific emulation environment:
```bash
makerboard run my7688
```

License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2015 Fred Chien <<cfsghost@gmail.com>>
