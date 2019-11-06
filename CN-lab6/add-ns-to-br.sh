

sudo ip link add name br0 type bridge
sudo ip link set dev br0 up

sudo brctl addbr br-test0
sudo ip netns add ns2
sudo ip link add eth0 type veth peer name eth1

sudo ip link set eth0 netns ns2
sudo ip netns exec ns2 ip address add 10.0.0.1/24 dev eth0

sudo ip netns exec ns2 ip link set eth0 up

sudo ip link set eth1 up

sudo brctl addif br-test0 eth1

sudo ip netns delete ns1
sudo ip link delete br-test0 type bridge
sudo ip link delete eth1
sudo ip link delete eth0

