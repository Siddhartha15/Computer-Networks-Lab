sudo ip netns add ns

sudo ip link add eth0 type veth peer name eth1
sudo ip link add eth2 type veth peer name eth3

sudo ip link set eth0 netns ns

sudo ip netns exec ns ip link set eth0 up
sudo ip link set eth3 up
sudo ip netns exec ns ip address add 10.0.0.1/24 dev eth0

sudo ip link add name br0 type bridge
sudo ip link set dev br0 up

sudo ip link set eth1 master br0
sudo ip link set eth2 master br0
# sudo ip link set eno1 netns ns1

sudo ip link set dev eth1 up
sudo ip link set dev eth2 up
# sudo ip netns exec ns dhclient
sudo ip netns exec ns ping 10.10.54.4


sudo ip netns delete ns

# sudo ip link delete eth1
# sudo ip link delete eth0


