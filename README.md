# MakerBoard

MakerBoard is utility and emulation for development boards, it supports `MediaTek LinkIt Smart 7688` and `MediaTek LinkIt Smart 7688 Duo` currently.

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
