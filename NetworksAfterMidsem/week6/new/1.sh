
sudo ip netns add ns

sudo ip link add eth0 type veth peer name eth1

sudo ip link set eth0 netns ns

sudo ip netns exec ns ip link set lo up

sudo ip netns exec ns ip link set eth0 up

sudo ip netns exec ns ip address add 10.0.0.1/24 dev eth0

sudo ping -c 5 10.0.0.3

sudo ip netns delete ns

sudo ip link delete eth1
